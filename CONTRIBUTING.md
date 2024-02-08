# Contributing

Thanks for contributing to this app!

## Development

This project uses [standard](https://npm.im/standard) for linting. Please make sure your code passes the linter before submitting a pull request.

## Pull Requests

This project follows the Conventional Commits spec to simplify and automate the process of releasing new versions.

When opening a pull request, give your PR title a semantic prefix like `fix:`, `feat:`, or `chore:` to indicate what kind of change you're making.

Here are some valid example  pull request titles:

- fix: Correct typo
- feat: Add support for Node.js 18
- refactor!: Drop support for Node.js 12 (breaking change)
- feat(ui): Add `Button` component

See [Conventional Commits](https://www.conventionalcommits.org/) for more examples.

## Release process

This project uses [Release Please](https://github.com/googleapis/release-please) and GitHub Actions to automate releases.

Release Please automates CHANGELOG generation, the creation of GitHub releases, and version bumps.

Rather than continuously releasing what's landed on the main branch, release-please maintains Release PRs, which are kept up to date as additional work is merged. When we're ready to tag a release, we merge the release PR and the release is published to GitHub and npm automatically.