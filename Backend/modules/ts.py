class time_series:
    def __init__(self):
        self.TS = {}  # Dictionary to store time series state

    def update(self, year, **kwargs):
        """
        Update the state for a specific year. This should be overridden by subclasses.
        """
        raise NotImplementedError("Subclasses must implement this method")
