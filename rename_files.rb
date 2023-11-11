#!/usr/bin/env ruby

require 'pry'
require 'time'

NUM_PREFIX_PATTERN = /\A\d{5}-/

ARGV.each do |folder|
  files = []
  prefixed_files = []

  Dir.glob("#{folder}/*").each_with_index do |file, index|
    res = `git log --follow --format=%aD #{file}`

    # if a file has the expected prefix we assume it has already been sorted
    if File.basename(file).match?(NUM_PREFIX_PATTERN)
      prefixed_files << file
    else
      begin
        files << { file: file, ctime: Time.parse(res) }
      rescue ArgumentError
        # Default time if git log fails
        files << { file: file, ctime: Time.parse("2016-01-01") }
      end
    end
  end

  # We sort by git creation time separate from files already renamed and sorted
  files.sort_by! { |file| file[:ctime] }.reverse!
  prefixed_files.sort_by! { |file| File.basename(file) }
  files = files.map { |f| f[:file] }

  files = files + prefixed_files

  files.each_with_index do |file, index|
    ext = File.extname(file)
    filename = File.basename(file, ext)

    filename = filename.sub(NUM_PREFIX_PATTERN, '') if filename.match?(NUM_PREFIX_PATTERN)

    puts "#{folder}/#{format('%05d', index + 1)}-#{filename}#{ext}"
    File.rename(file, "#{folder}/#{format('%05d', index + 1)}-#{filename}#{ext}")
  end
end

