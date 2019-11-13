'use strict';

require('dotenv').config();
const videoIntelligence = require('@google-cloud/video-intelligence');
const client = new videoIntelligence.VideoIntelligenceServiceClient({projectId: process.env.GCP_PROJECTID, keyFilename: process.env.CREDENTIAL_PATH});

const getVideoLabel = async gcsUri => {
  const label = new Set();
  const cLabel = new Set();
  // 라벨분석
  const labelAnaly = {
    inputUri: gcsUri,
    features: ['LABEL_DETECTION'],
  };

  const [operation] = await client.annotateVideo(labelAnaly);
  console.log('Waiting for operation to complete... (this may take a few minutes)');
  const [operationResult] = await operation.promise();
  // console.log(`operationResult. length: ${operationResult.annotationResults[0].shotLabelAnnotations.length}`)
  for (let [idx, {categoryEntities, entity, segments}] of Array.from(operationResult.annotationResults[0].shotLabelAnnotations).entries()) {
    let cEntity = categoryEntities[0];
    if (!!cEntity) {
      // // console.dir(`categoryEntity: ${cEntity}`);
      // console.log(`description: ${cEntity.description}`)
      // console.log(`entityId: ${cEntity.entityId}`);
      cLabel.add(cEntity.description);
    }
    // // console.dir(`entity: ${entity}`);
    // console.log(`description: ${entity.description}`);
    // console.log(`entityId: ${entity.entityId}`);
    label.add(entity.description);
  }
  return {label: Array.from(label), cLabel: Array.from(cLabel)};
}

const main = async () => {
  console.dir(await getVideoLabel());
}

// main().catch(console.error);

module.exports = getVideoLabel;