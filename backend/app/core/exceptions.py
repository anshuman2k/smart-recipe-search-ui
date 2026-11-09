from typing import Union


class SpoonacularAPIError(Exception):
    """Exception raised when an upstream Spoonacular API request fails."""

    def __init__(
        self,
        message: str,
        status_code: int = 502,
        is_quota_exceeded: bool = False,
    ):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.is_quota_exceeded = is_quota_exceeded


class RecipeNotFoundError(Exception):
    """Exception raised when a requested recipe ID is not found."""

    def __init__(self, recipe_id: Union[int, str]):
        message = f"Recipe with ID {recipe_id} was not found."
        super().__init__(message)
        self.recipe_id = recipe_id
        self.message = message
        self.status_code = 404
