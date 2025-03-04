import os
import json

class ConfigUtil:
    CONFIG_FILE_NAME = "config.json"
    REQUIRES_REVIEW_KEY = "requires_review"
    DEFAULT_REQUIRES_REVIEW = False

    @staticmethod
    def requires_review(base_path, *paths):
        config_file_path = os.path.join(base_path, *paths, ConfigUtil.CONFIG_FILE_NAME)

        if not os.path.isfile(config_file_path):
            return ConfigUtil.DEFAULT_REQUIRES_REVIEW 
        
        with open(config_file_path, 'r') as config_file:
            config = json.load(config_file)
            
        return config.get(ConfigUtil.REQUIRES_REVIEW_KEY, ConfigUtil.DEFAULT_REQUIRES_REVIEW)
