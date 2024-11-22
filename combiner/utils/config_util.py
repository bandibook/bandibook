import os
import yaml

class ConfigUtil:
    CONFIG_FILE_NAME = "config.yaml"
    DEFAULT_REQUIRES_REVIEW = True

    @staticmethod
    def requires_review(base_path):
        config_file_path = os.path.join(base_path, ConfigUtil.CONFIG_FILE_NAME)

        if not os.path.isfile(config_file_path):
            return ConfigUtil.DEFAULT_REQUIRES_REVIEW 
        
        with open(config_file_path, 'r') as config_file:
            try:
                config = yaml.safe_load(config_file)
            except yaml.YAMLError:
                return ConfigUtil.DEFAULT_REQUIRES_REVIEW
            
        return config.get('requires_review', ConfigUtil.DEFAULT_REQUIRES_REVIEW)
