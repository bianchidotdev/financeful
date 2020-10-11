module Darby
  module Configurable
    def initialize(params = {})
      params.each do |key, value|
        setter = "#{key}="
        send(setter, value) if respond_to?(setter.to_sym, false)
      end
    end
    
    def self.included(klass)
      klass.extend(ClassMethods)
    end

    module ClassMethods
      def config
        Global.send(self::CONFIG)
      end

      def valid
        @valid ||= all.select { |instance| puts instance; instance.valid? }
      end

      def all
        @all ||= Global.send(self::CONFIG).all.flatten.map { |config| new_from_config(config) }
      end

      def new_from_config(config)
        if config.keys.none? { |key| self::ALLOWED_ATTRIBUTES.include?(key.to_sym) }
          raise "Invalid key #{key}"
        end
        self.new(config)
      end
    end
  end
end