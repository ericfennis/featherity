import { promises as fs } from 'fs';

const json = `
{
  "lucide-figma": {
    "location": "packages/lucide-figma",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": [
      "lucide-react"
    ]
  },
  "lucide-react": {
    "location": "packages/lucide-react",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "lucide-vue": {
    "location": "packages/lucide-vue",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "lucide": {
    "location": "packages/lucide",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": []
  },
  "site": {
    "location": "site",
    "workspaceDependencies": [],
    "mismatchedWorkspaceDependencies": [
      "lucide-react"
    ]
  }
}`;

// eslint-disable-next-line func-names
(async function() {
  const packages = JSON.parse(json);

  const packageJsonsFileReadings = Object.values(packages).map(({ location }) =>
    fs.readFile(`${location}/package.json`, 'utf-8'),
  );

  const packageJsonsRaw = await Promise.all(packageJsonsFileReadings);
  const allPackageJsons = packageJsonsRaw.map(JSON.parse);
  const packageJsons = allPackageJsons.filter(item => !item.private);
  console.log(packageJsons);
})();
