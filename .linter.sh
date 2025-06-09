#!/bin/bash
cd /home/kavia/workspace/code-generation/petchronicle-36940-551dad2d/petchronicle
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

