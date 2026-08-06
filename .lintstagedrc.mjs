/**
 * lint-staged configuration.
 *
 * `tsc --noEmit` cannot accept individual files as arguments (TS5112:
 * tsconfig is ignored when files are passed on the command line). The
 * typecheck task therefore runs as a whole-project command regardless of
 * which files are staged — lint-staged invokes it without passing filenames.
 *
 * `eslint` does accept file arguments, so lint runs per staged file.
 */
export default {
  "*.{ts,json}": ["eslint -c eslint.config.mjs --fix"],
  "*.ts": [() => "npm run typecheck"],
};
