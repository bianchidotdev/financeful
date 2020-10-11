require "alphavantagerb"

module Darby
  class AlphaVantage
    class << self
      def client
        @client ||= Alphavantage::Client.new key: ENV["ALPHAVANTAGE_API_KEY"]
      end
    end
  end
end
