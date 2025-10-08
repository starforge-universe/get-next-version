# Template Merging Process

Follow these steps to merge updates from the template remote into your repository:

1. **Update your local main branch**
   ```sh
   git checkout main
   git pull origin main
   ```

2. **Fetch all remotes**
   ```sh
   git fetch --all
   ```

3. **Create a feature branch for the template update**
   ```sh
   git checkout -b feature/template-update
   ```

4. **Merge changes from the template remote's main branch**
   - Execute this command:
      ```sh
      git merge template/main -m "Merge template updates"
    
      ```
   - Resolve merge conflicts acconding to the following aspects.
      - You must keep dependencies of origin but version numbers must be taken from the template.
      - Ask help in every other cases to resolve merge conflicts.
      - Use git add command to add the changes files.
   - Understand the content of `./.github/workflows/__call__checks.yaml` GitHub Workflow definition and execute all the checks locally.

5. **Push the feature branch and open a pull request**
   ```sh
   git push origin feature/template-update
   ```

6. **Switch back to main and clean up the feature branch locally**
   ```sh
   git checkout main
   git branch -D feature/template-update
   ```
