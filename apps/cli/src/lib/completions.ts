const COMMANDS = ['create', 'create-json', 'validate', 'add', 'history', 'mcp', 'completion']
const FAMILIES = [
  'fullstack',
  'next',
  'backend',
  'rust',
  'solana',
  'convex',
  'worker',
  'lib',
  'cli',
  'mobile',
  'polyglot',
]
const PRESETS = [
  'typescript-fullstack',
  'rust-api',
  'rust-fullstack',
  'convex-product',
  'solana-program',
  'solana-web',
  'solana-mobile',
  'solana-product',
  'customize',
  'experiments',
]
const PACKAGE_MANAGERS = ['bun', 'pnpm', 'npm']
const OPTIONS = [
  '--yes',
  '--dir=',
  '--output=',
  '--family=',
  '--preset=',
  '--pm=',
  '--package-manager=',
  '--bundle=',
  '--git',
  '--no-git',
  '--install',
  '--no-install',
  '--showcase',
  '--no-showcase',
  '--worker',
  '--no-worker',
  '--docker',
  '--no-docker',
  '--ci',
  '--no-ci',
  '--tests=',
  '--deployment=',
  '--dry-run',
  '--backend=',
  '--database=',
  '--orm=',
  '--version',
  '--help',
]

function words(values: string[]): string {
  return values.join(' ')
}

export function renderBashCompletion(): string {
  return `# bash completion for arche
_arche_completion() {
  local cur prev
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"

  case "$prev" in
    completion)
      COMPREPLY=( $(compgen -W "bash zsh" -- "$cur") )
      return 0
      ;;
  esac

  case "$cur" in
    --family=*)
      COMPREPLY=( $(compgen -W "${words(FAMILIES)}" -- "\${cur#--family=}") )
      return 0
      ;;
    --preset=*)
      COMPREPLY=( $(compgen -W "${words(PRESETS)}" -- "\${cur#--preset=}") )
      return 0
      ;;
    --pm=*|--package-manager=*)
      COMPREPLY=( $(compgen -W "${words(PACKAGE_MANAGERS)}" -- "\${cur#*=}") )
      return 0
      ;;
    --*)
      COMPREPLY=( $(compgen -W "${words(OPTIONS)}" -- "$cur") )
      return 0
      ;;
  esac

  COMPREPLY=( $(compgen -W "${words([...COMMANDS, ...FAMILIES])}" -- "$cur") )
}

complete -F _arche_completion arche create-arche
`
}

export function renderZshCompletion(): string {
  return `#compdef arche create-arche

local -a commands families presets package_managers options
commands=(${COMMANDS.map((value) => `"${value}"`).join(' ')})
families=(${FAMILIES.map((value) => `"${value}"`).join(' ')})
presets=(${PRESETS.map((value) => `"${value}"`).join(' ')})
package_managers=(${PACKAGE_MANAGERS.map((value) => `"${value}"`).join(' ')})
options=(${OPTIONS.map((value) => `"${value}"`).join(' ')})

case "$words[2]" in
  completion)
    _describe 'shell' '("bash" "zsh")'
    return
    ;;
esac

case "$PREFIX" in
  --family=*)
    _values 'family' $families
    ;;
  --preset=*)
    _values 'preset' $presets
    ;;
  --pm=*|--package-manager=*)
    _values 'package manager' $package_managers
    ;;
  --*)
    _describe 'option' options
    ;;
  *)
    _describe 'command' commands
    _describe 'family' families
    ;;
esac
`
}

export function renderCompletion(shell: 'bash' | 'zsh'): string {
  return shell === 'bash' ? renderBashCompletion() : renderZshCompletion()
}
