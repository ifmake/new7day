
#python 自动化部署
#!/usr/bin/env python

import os

from fabric.api import (
    cd,
    env,
    run,
    task,
    roles,
    local,
    prefix,
)

env.roledefs = {
  'prod': ['root@47.93.0.160']
}

@task
@roles('prod')
def prod(reset=False):
  with cd('/work/newDay/'):
    if reset:
        run('git reset --hard HEAD~1')
    else:
        run('git checkout -- .')
    run('git pull --rebase origin master')
    run('npm i')
    run('npm run build --prod-aot')
