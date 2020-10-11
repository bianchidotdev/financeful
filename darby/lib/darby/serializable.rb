module Darby
  module Serializable
    def serialize
      {
        name: name,
        holdings: reaviz_weights,
        hypotheticalGrowth: df_to_highchart_hash(normalized_df(date_range: timeframe_to_date_range(timeframe: '10y'))),
        dailyTimeseries: df_to_highchart_hash(raw_df),
        annualizedReturns: hash_to_table(returns_hash),
        totalReturns: hash_to_table(annualized_returns_hash),
      }
    end

    def reaviz_weights
      weights.each_with_object([]) do |(symbol, weight), reaviz_arr|
        reaviz_arr << { key: symbol, data: (weight * 100).to_i }
      end
    end

    def df_to_highchart_hash(df)
      {
        title: {
          text: df.name
        },
        series: series(df)
      }
    end

    def hash_to_table(hash)
      hash
    end

    def series(df)
      df.vectors.map do |vec_name|
        {
          data: series_data(df[vec_name]),
          name: vec_name,
          tooltip: {
                valueDecimals: 2
            }
        }
      end
    end

    def series_data(vector)
      vector.index.map(&:to_date).zip(vector).map do |date, value|
        [date_to_ms_timestamp(date), value]
      end
    end

    def date_to_ms_timestamp(date)
      date.to_time.to_i * 1000
    end
  end
end
