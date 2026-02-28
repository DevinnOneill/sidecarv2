'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

// --- TAILWIND INTEGRATION START ---
const postcss = require("postcss");
const tailwindcss = require("tailwindcss");
const autoprefixer = require("autoprefixer");

const tailwindSetup = build.subTask(
  "tailwindcssSetup",
  (gulp, buildOptions, done) => {
    build.rig.getTasks().forEach(task => { // Fix: getTasks() not getBuildTasks()
      // Intercept the SASS compilation task
      if (task.buildConfig && task.buildConfig.taskName === "sass") {
        if (task.taskConfig) {
          task.taskConfig.postCSSPlugins = [
            tailwindcss(),
            autoprefixer()
          ];
        }
      }
    });

    // Also inject into the generic webpack config to catch all CSS/SCSS
    build.configureWebpack.mergeConfig({
      additionalConfiguration: (generatedConfiguration) => {
        generatedConfiguration.module.rules.forEach(rule => {
          if (rule.use && Array.isArray(rule.use)) {
            rule.use.forEach(loader => {
              if (loader.loader === 'postcss-loader' && loader.options) {
                loader.options.postcssOptions = loader.options.postcssOptions || { plugins: [] };
                loader.options.postcssOptions.plugins.push(tailwindcss());
                loader.options.postcssOptions.plugins.push(autoprefixer());
              }
            });
          }
        });
        return generatedConfiguration;
      }
    });

    done();
  }
);

// Register the custom task right before TypeScript compiles
build.rig.addPreBuildTask(tailwindSetup);
// --- TAILWIND INTEGRATION END ---

build.initialize(require('gulp'));
