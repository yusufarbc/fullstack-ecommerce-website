import { ComponentLoader } from 'adminjs';
import uploadFeature from '@adminjs/upload';
import { BaseProvider } from '@adminjs/upload';

class MockProvider extends BaseProvider {
    constructor() { super('bucket'); }
    async upload() { }
    async delete() { }
    async path() { }
}

const loader = new ComponentLoader();
console.log('Initial components:', Object.keys(loader.components));

const feature = uploadFeature({
    provider: new MockProvider(),
    componentLoader: loader,
    properties: { key: 'imageUrl', file: 'imageFile' }
});

console.log('Components after feature:', Object.keys(loader.components));

if (loader.components['UploadEditComponent']) {
    console.log('SUCCESS: UploadEditComponent is registered.');
} else {
    console.log('FAILURE: UploadEditComponent is MISSING.');
}
