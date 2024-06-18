import argparse
from combiner.job.combine_job import CombineJob

if __name__ == '__main__':
	parser = argparse.ArgumentParser()
	parser.add_argument('--job', help='Job name')
	parser.add_argument('--source-directory', help='Source Directory Name')
	parser.add_argument('--target-directory', help='Target Directory Name')
	parser.add_argument('--cache-file', help='Cache File Name')
	args = parser.parse_args()

	if args.job == "CombineJob":
		CombineJob(args.source_directory, args.target_directory, args.cache_file).run()