import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';

const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**'],
  nonJs: ['./package.json', './.gitignore'],
  tests: './src/tests/*.js'
};

// Limpando o diretório dist
gulp.task('clean', () =>
  del(['dist/**', '!dist', ])
);

// Copiar os arquivos que não são js para o dist
gulp.task('copy', () =>
  gulp.src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

// Compile ES6/ES7 para ES5 e copie para o dist
gulp.task('babel', () =>
  gulp.src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(plugins.sourcemaps.write('.', {
      includeContent: false,
      sourceRoot(file) {
        return path.relative(file.path, __dirname);
      }
    }))
    .pipe(gulp.dest('dist'))
);

// Servidor iniciado com restart automático quando hover alterações em arquivos
gulp.task('nodemon', ['copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel']
  })
);

// Tarefa Gulp para inviar o servidor em desenvolvimento
gulp.task('serve', ['clean'], () => runSequence('nodemon'));

// tarefa padrão: remover o dist, compilar os arquivos js and copiar os arquivos que não são js
gulp.task('default', ['clean'], () => {
  runSequence(
    ['copy', 'babel']
  );
});
