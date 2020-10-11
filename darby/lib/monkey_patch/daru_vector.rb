class Daru::Vector
  def rolling_function(function, n = 10)
    # TODO: define method on vector arbitrarily and call it with rolling
  end

  def drawdown_percentage
    ((last - max) / max) * 100
  end
end
