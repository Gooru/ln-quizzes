#!/usr/bin/python

import os, sys

innerDir = sys.argv[1] if len(sys.argv) > 1 else ''
projectDir = os.path.dirname(os.path.realpath(__file__))
addonDir = '%s/addon/%s/' % (projectDir, innerDir)
importDir = 'quizzes-addon'
for root, dirs, files in os.walk(addonDir):
  for file in files:
    if file.endswith('.js'):
      filePath = os.path.join(root, file)
      importPath = '%s%s' % (importDir, filePath[filePath.find('addon') + 5:-3])
      newDir = root.replace('addon', 'app')
      newPath = os.path.join(newDir, file)
      if not os.path.exists(newDir):
        try:
          os.makedirs(newDir)
        except OSError as exc:
          if exc.errno != errno.EEXIST:
            raise
      with open(newPath, 'w+') as appFile:
        appFile.write('export { default } from \'%s\';' % (importPath))
