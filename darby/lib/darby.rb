
REPO_ROOT = File.join(File.dirname(__FILE__), "../..")
PROJECT_ROOT = File.join(REPO_ROOT, "darby")
SITE_ROOT = File.join(REPO_ROOT, "site")

$:.unshift(File.join(PROJECT_ROOT, 'lib'))

require 'active_support'
require 'active_support/core_ext'
require 'active_model'
require 'daru'
require 'monkey_patch/daru_vector'

require "initializers/global_config"
require "initializers/retriable"

require "zeitwerk"
loader = Zeitwerk::Loader.for_gem
loader.setup

module Darby
  class << self
    def generate_analyzed_data
      puts "Generating portfolio and stock data"
      quantables.each(&:write!)
      puts "Completed generating portfolio and stock data"
    end

    def clean_content_directory
      dirs = [Darby::Stock.all.first, Darby::Portfolio.all.first].map(&:output_dir)
      dirs.each do |dir|
        puts "Removing data files from #{dir}"
        FileUtils.rm Dir.glob("#{dir}/*.json")
      end
    end

    def quantables
      @quantables ||= Darby::Stock.all + Darby::Portfolio.all
    end
  end
end
