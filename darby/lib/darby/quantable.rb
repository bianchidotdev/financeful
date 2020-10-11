module Darby
  module Quantable
    include Serializable

    delegate :default_amount, to: "Global.holdings"

    # including classes need to implement data_vector
    
    # stats_df columns
    # rolling_drawdown_percentage, percent_change, std_dev
    # rolling_10yr_return, rolling_5yr_return, rolling_1yr_return

    def write!
      puts "Writing #{name} data to #{output_dir}"
      File.open(output_path, "w") do |f|
        f.write(serialize.to_json)
      end
    end

    def plottable_df
      Daru::DataFrame.new({adjusted_close: normalized_data_vector}, index: normalized_data_vector.index)
    end

    def stats_df(date_range: @date_range, dataset_size: @dataset_size)
      @stats_df = Daru::DataFrame.new(
        adjusted_close: data_vector(date_range: date_range, dataset_size: dataset_size),
        percent_change: percent_change,
      )
      # bc rolling blows up if there aren't enough elements
      @stats_df[:rolling_drawdown_percentage] = rolling_drawdown_percentage if data_vector.size > 13
      @stats_df
    end

    def monthly_data_vector
      @monthly_data_vector ||= begin
        months = data_vector.index.map { |date| "#{date.year}-#{date.month}"}.uniq
        values = months.map { |month| get_last_value(data_vector[month]) }
        Daru::Vector.new(values, index: months)
      end
    end

    def get_last_value(value)
      return value if value.is_a?(Float)

      value.last.first
    end

    def normalized_data_vector(date_range: nil, weight: 1.0)
      vector = data_vector(date_range: date_range)
      stock_count = (default_amount * weight) / vector[0]
      vector * stock_count
    end

    def returns_hash
      {
        "ytd": ytd,
        "1y": returns_for_timeframe(timeframe: "1y"),
        "3y": returns_for_timeframe(timeframe: "3y"),
        "5y": returns_for_timeframe(timeframe: "5y"),
        "10y": returns_for_timeframe(timeframe: "10y")
      }
    end

    def annualized_returns_hash
      {
        "ytd": annualized_ytd,
        "1y": annualized_returns_for_timeframe(timeframe: "1y"),
        "3y": annualized_returns_for_timeframe(timeframe: "3y"),
        "5y": annualized_returns_for_timeframe(timeframe: "5y"),
        "10y": annualized_returns_for_timeframe(timeframe: "10y")
      }
    end

    def returns_for_timeframe(timeframe:)
      # needs a to_a bc for some reason datetimeindex doesn't implement last
      end_date = data_vector.index.to_a.last.to_date
      start_date = end_date - timeframe(timeframe: timeframe)
      returns(start_date: start_date, end_date: end_date)
    end

    def returns(start_date:, end_date:)
      return "N/A" if start_date < data_vector.index.first

      end_date = find_date(date: end_date)
      start_date = find_date(date: start_date)
      (data_vector[end_date.to_s] - data_vector[start_date.to_s]) / data_vector[start_date.to_s]
    end

    def annualized_returns_for_timeframe(timeframe:)
      end_date = data_vector.index.to_a.last.to_date
      start_date = end_date - timeframe(timeframe: timeframe)
      annualized_returns(start_date: start_date, end_date: end_date)
    end

    def annualized_returns(start_date:, end_date:)
      return "N/A" if start_date < data_vector.index.first
      end_date = find_date(date: end_date)
      start_date = find_date(date: start_date)

      ((1 + returns(start_date: start_date, end_date: end_date)) ** (365 / (end_date - start_date))) - 1
    end

    def percent_change
      data_vector.percent_change
    end

    def ytd
      returns(start_date: data_vector.index[Date.today.year.to_s].first, end_date: Date.today)
    end

    def annualized_ytd
      annualized_returns(start_date: data_vector.index[Date.today.year.to_s].first, end_date: Date.today)
    end

    def volatility
      root_mean_square(rolling_drawdown_percentage.only_valid)
    end

    def rolling_drawdown_percentage
      data_vector.rolling(:drawdown_percentage, 14)
    end
    
    def output_dir
      File.join(SITE_ROOT, self.class.config["output_dir"])
    end

    def timeframe(timeframe:)
      case timeframe
      when /^(\d+)y/i
        $1.to_i.years
      when /^(\d+)d/i
        $1.to_i
      end
    end

    private

    def filter_vector(vector:, date_range: nil, dataset_size: nil)
      v = date_range.nil? ? vector : vector[date_range.first.to_s..date_range.last.to_s]
      dataset_size.nil? ? v : v.last(dataset_size)
    end

    def timeframe_to_date_range(timeframe:)
      today = Date.today
      (today - timeframe(timeframe: timeframe))..today
    end

    def find_date(date:)
      if data_vector.index.first > date
        puts "lookback for #{date} is older than oldest date #{data_vector.index.first}. Using oldest date."
        date = data_vector.index.first
      elsif data_vector.index.to_a.last < date
        puts "lookback for #{date} is newer than most recent date #{data_vector.index.to_a.last}. Using most recent date."
        date = data_vector.index.to_a.last
      end
      date = date.to_date if date.is_a?(DateTime)
      data_vector[date.to_s].blank? ? find_date(date: date - 1) : date
    end

    def root_mean_square(array)
      Math.sqrt(array.reduce(0) { |acc, price| acc += price ** 2 } / array.size)
    end

    def output_path
      File.join(output_dir, filename)
    end
  end
end
