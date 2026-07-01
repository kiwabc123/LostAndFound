"""Custom exceptions for the application."""

class ApplicationException(Exception):
    """Base exception for the application."""
    pass

class ItemNotFoundError(ApplicationException):
    """Raised when an item is not found."""
    pass

class UnauthorizedError(ApplicationException):
    """Raised when user is not authorized."""
    pass

class ValidationError(ApplicationException):
    """Raised when validation fails."""
    pass

class MatchingError(ApplicationException):
    """Raised when matching fails."""
    pass

class StorageError(ApplicationException):
    """Raised when storage operation fails."""
    pass

class NotificationError(ApplicationException):
    """Raised when notification sending fails."""
    pass
