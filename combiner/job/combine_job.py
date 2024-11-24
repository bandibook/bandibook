import os
from combiner.service.combiner import Combiner
from combiner.utils.parser import Parser
from combiner.service.copier import FileCopier
from combiner.utils.config_util import ConfigUtil

class CombineJob:
    def __init__(self, root_dir, combine_dir, cache_file):
        self.root_dir = root_dir
        self.combine_dir = combine_dir
        self.combiner = Combiner(root_dir, combine_dir, cache_file)
        self.file_copier = FileCopier(root_dir, combine_dir, cache_file)

    def run(self):
        study_names = Parser.find_all_directories(self.root_dir)

        for study_name in study_names:
           self.combine_study(study_name)

    def combine_study(self, study_name):
        book_names = Parser.find_all_directories(self.root_dir, study_name)

        for book_name in book_names:
            study_book_name = Parser.join_paths(study_name, book_name)
            book_path = Parser.join_paths(self.root_dir, study_book_name)
            
            if ConfigUtil.requires_review(self.root_dir, study_name):
                reviewer_count = len(Parser.find_all_directories(book_path))
                all_finished_files = Parser.find_common_files(book_path)
                self.combiner.combine(all_finished_files, book_path, study_book_name, reviewer_count)
            else:
                self.file_copier.copy_files(study_book_name)
