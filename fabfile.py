import os

import fabdeploytools.envs
from fabric.api import env, lcd, local, task
from fabdeploytools import helpers

import deploysettings as settings

env.key_filename = settings.SSH_KEY
fabdeploytools.envs.loadenv(settings.CLUSTER)
ROOT, YOGAFIRE = helpers.get_app_dirs(__file__)
COMMONPLACE = '%s/node_modules/commonplace/bin/commonplace' % YOGAFIRE


@task
def pre_update(ref):
    with lcd(YOGAFIRE):
        local('git fetch')
        local('git fetch -t')
        local('git reset --hard %s' % ref)


@task
def update():
    with lcd(YOGAFIRE):
        local('npm install')
        local('npm install --force commonplace@0.3.2')
        local('%s includes' % COMMONPLACE)
        local('%s langpacks' % COMMONPLACE)


@task
def deploy():
    helpers.deploy(name=settings.PROJECT_NAME,
                   app_dir='yogafire',
                   env=settings.ENV,
                   cluster=settings.CLUSTER,
                   domain=settings.DOMAIN,
                   root=ROOT)


@task
def pre_update_latest_tag():
    current_tag_file = os.path.join(YOGAFIRE, '.tag')
    latest_tag = helpers.git_latest_tag(YOGAFIRE)
    with open(current_tag_file, 'r+') as f:
        if f.read() == latest_tag:
            print 'Environment is at %s' % latest_tag
        else:
            pre_update(latest_tag)
            f.seek(0)
            f.write(latest_tag)
            f.truncate()
