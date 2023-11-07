#!/usr/bin/env ruby

require 'pry'
require 'time'

ARGV.each do |folder|
  files = []

  Dir.glob("#{folder}/*").each_with_index do |file, index|
    res = `git log --follow --format=%aD #{file}`

    begin
      files << { file: file, ctime: Time.parse(res) }
    rescue ArgumentError
      # Default time if git log fails
      files << { file: file, ctime: Time.parse("2016-01-01") }
    end
  end

  files.sort_by! { |file| file[:ctime] }.reverse!

  files.each_with_index do |file, index|
    ext = File.extname(file[:file])
    filename = File.basename(file[:file], ext)
    puts "#{folder}/#{format('%05d', index + 1)}-#{filename}#{ext}"
    File.rename(file[:file], "#{folder}/#{format('%05d', index + 1)}-#{filename}#{ext}")
  end
end

