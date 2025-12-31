import { ComponentLoader } from 'adminjs';
import uploadFeature from '@adminjs/upload';

console.log('UploadFeature:', uploadFeature);
// Check if uploadFeature exposes components
const feature = uploadFeature({ properties: { file: 'file', key: 'key' } });
console.log('Feature:', feature);
