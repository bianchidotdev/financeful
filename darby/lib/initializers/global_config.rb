require 'global'

Global.backend(:filesystem, environment: ENV["ENV"] || 'development', path: "#{PROJECT_ROOT}/config/global")
