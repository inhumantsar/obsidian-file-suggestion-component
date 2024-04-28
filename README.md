# File Suggestion Component for Obsidian Plugins

Provides a text input with on-the-fly file and/or folder suggestions.

Suggestions are scored using its own fuzzy search logic. Scores are based on Damerau-Levenshtein distance between the query and the file/folder name. Multipliers ensure that the suggestions will prioritize names which contain or start with the query string.

# Usage

... TODO ...

# Development Environment

## direnv

There is a `direnv` config which can be used to quickly configure a completely isolated local environment. Setting it up requires a few extra steps though.

1. Install the Nix package manager: `sh <(curl -L https://nixos.org/nix/install) --no-daemon`
2. Ensure `flakes` and `nix-command` are enabled, eg: `mkdir -p ~/.local/nix && echo "experimental-features = nix-command flakes" >> nix.conf`
2. Install `direnv`, adjusting or removing `bin_path` as needed: `curl -sfL https://direnv.net/install.sh | bin_path=~/.local/bin bash`
3. `direnv` will instruct you to add a line to your `.bashrc`, once that's done, run `direnv allow`.

# Testing

```
npm test
```

Note that Obsidian libraries have to be mocked for Jest to function properly. These are stored in `test/__mocks__/obsidian.ts`.

# Credits

* Unit tests draw on an [English word list](https://www.wordgamedictionary.com/english-word-list/) created by wordgamedictionary.com.

# License

[MIT](./LICENSE)