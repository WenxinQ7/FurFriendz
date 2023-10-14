const { execSync } = require("child_process");

const start_date = new Date("2023-10-10T10:30:29Z");
const end_date = new Date("2023-10-15T23:29:54Z");

const totalCommits = parseInt(
  execSync("git rev-list --count HEAD").toString(),
  10
);
const intervalMs = (end_date - start_date) / totalCommits;

let current_date = end_date;

for (let i = 0; i < totalCommits; i++) {
  const commitHash = execSync(`git rev-list --skip=${i} --max-count=1 HEAD`)
    .toString()
    .trim();

  const GIT_COMMITTER_DATE = current_date.toISOString();
  const GIT_AUTHOR_DATE = GIT_COMMITTER_DATE;

  const cmd = `
        git filter-branch -f --env-filter '
            if [ "$GIT_COMMIT" = "${commitHash}" ]; then
                export GIT_COMMITTER_DATE="${GIT_COMMITTER_DATE}";
                export GIT_AUTHOR_DATE="${GIT_AUTHOR_DATE}";
            fi
        ' HEAD
    `;

  execSync(cmd);

  current_date = new Date(current_date.getTime() - intervalMs);
}

console.log("Commit dates have been adjusted!");
