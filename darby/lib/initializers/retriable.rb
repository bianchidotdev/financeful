require "retriable"
require 'retriable/core_ext/kernel'

RETRY_PROC = proc do |exception, try, elapsed_time, next_interval|
  retry_data = {
    exception:     exception,
    try:           try,
    elapsed_time:  elapsed_time,
    next_interval: next_interval
  }
  puts("Retry occurred", retry_data)
end

Retriable.configure do |c|
  c.on_retry = RETRY_PROC
  c.contexts[:alpha_vantage] = {
    tries: 10,
    base_interval: 20.0
  }
end
