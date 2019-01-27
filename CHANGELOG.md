# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.0.0] - 2019-01-25

### Added

- Support for [ArchieML](http://archieml.org/) files. These are processed when they are found with the `.aml` extension.
- Support for JavaScript files. This includes any JavaScript file that provides a default export (`module.exports = ...`). JavaScript files that export functions, including _async_ functions, are also supported! This makes it possible for `quaff` to load data that's fetched from an API. Load GraphQL and go to town! Do some extra-preprocessing!

### Changed

- `quaff` now returns a **Promise** to enable async resolution of JavaScript files.
- Moves testing to `nyc`.
- Now requires Node.js **8 or later**.
