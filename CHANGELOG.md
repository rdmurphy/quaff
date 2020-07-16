# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.2.0] - 2020-07-16

### Added

- `quaff` will now throw an error when more than one input file attempts to use the same output key. This is caused by having multiple files in a directory with the same name but different extensions.
- When a `.yaml` or `.yml` file fails to parse the thrown error will now include the file path.
- We are now testing `quaff` in Mac OS and Windows thanks to GitHub Actions. Don't expect that'll ever be an issue good to know for sure.

### Changed

- `tiny-glob` has been replaced with [`totalist`](https://github.com/lukeed/totalist), which makes quaff a little faster at iterating through files.
- All tests have been moved to [`uvu`](https://github.com/lukeed/uvu).

## [4.1.0] - 2019-03-04

### Added

- Added TypeScript definition file.

### Changed

- Some housekeeping in `index.js`, but no functional changes.

## [4.0.0] - 2019-01-25

### Added

- Support for [ArchieML](http://archieml.org/) files. These are processed when they are found with the `.aml` extension.
- Support for JavaScript files. This includes any JavaScript file that provides a default export (`module.exports = ...`). JavaScript files that export functions, including _async_ functions, are also supported! This makes it possible for `quaff` to load data that's fetched from an API. Load GraphQL and go to town! Do some extra-preprocessing!

### Changed

- `quaff` now returns a **Promise** to enable async resolution of JavaScript files.
- Moves testing to `nyc`.
- Now requires Node.js **8 or later**.
