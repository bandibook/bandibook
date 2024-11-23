import os
import json

class ConfigUtil:
    CONFIG_FILE_NAME = "config.json"
    REQUIRES_REVIEW_KEY = "requires_review"
    DEFAULT_REQUIRES_REVIEW = True

    @staticmethod
    def requires_review(base_path, *paths):
        config_file_path = os.path.join(base_path, *paths, ConfigUtil.CONFIG_FILE_NAME)

        if not os.path.isfile(config_file_path):
            return ConfigUtil.DEFAULT_REQUIRES_REVIEW 
        
        with open(config_file_path, 'r') as config_file:
            try:
                config = json.load(config_file)
            except (json.JSONDecodeError, OSError):
                return ConfigUtil.DEFAULT_REQUIRES_REVIEW
            
        return config.get(ConfigUtil.REQUIRES_REVIEW_KEY, ConfigUtil.DEFAULT_REQUIRES_REVIEW)
