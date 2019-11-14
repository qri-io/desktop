import { configure } from '@storybook/react';
import '../app/app.global.scss';

// automatically import all files ending in *.stories.tsx
configure(require.context('../stories', true, /\.stories\.tsx$/), module);
