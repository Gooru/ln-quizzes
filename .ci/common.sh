WORKDIR=$PWD

RED="\e[31m"
GREEN="\e[32m"
NORMAL="\e[0m"

function error() {
  echo -e "\n$RED-------> $1 $NORMAL"
}

function info() {
  echo -e "\n$GREEN-------> $1 $NORMAL"
}

function silent() {
  ("${@}" &> build.log) &
  PID=$!
  show_spinner "$PID"

  wait $PID ## sets exit code from command

  handle_error $?
}

function handle_error() {
  local code=$1
  if [ "$code" -ne 0 ]; then
    error "Build error"
    cat build.log
    exit $code
  fi
}

function show_spinner() {
  local -r pid="${1}"
  local -r delay='1m'
  local temp
  while ps a | awk '{print $1}' | grep -q "${pid}"; do
    echo "Still running... ¯\_(ツ)_/¯"
    sleep "${delay}"
  done
}


