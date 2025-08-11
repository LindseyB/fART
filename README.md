# fART - Digital Art Gallery

A modern, responsive Jekyll-based gallery for showcasing digital artwork with a clean, professional design.

## Development

To run locally:

```bash
bundle install
bundle exec jekyll serve
```

To add a new image and sort them:

```bash
git add filename.png # needs to be added to git for date information
ruby rename_files.rb scans
git add -A && git commit # add and commit all the changed files so all the renames get commited
```

## License

Artwork © LindseyB. All rights reserved.
Code is available under MIT license.

---

*Built with ❤️ and hosted on GitHub Pages*
