const { CloudFrontClient, CreateInvalidationCommand , GetInvalidationCommand } = require("@aws-sdk/client-cloudfront");
const core = require('@actions/core');
const github = require('@actions/github');

const cloudfront = new CloudFrontClient({region: core.getInput('aws_region')});


const checkCFCacheInvalidationStatus = async (CFDistributionID, CFInvalidationID) => {
    let status = 'InProgress';
    while (status === 'InProgress') {
      const invalidationResult = await cloudfront.send(new GetInvalidationCommand({
        DistributionId: CFDistributionID,
        Id: CFInvalidationID,
      }));
  
      status = invalidationResult.Invalidation.Status;
      console.log(`Current status: ${status}`);
      
      console.log(`Waiting for 5 seconds before re-checking the status ...`)
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return status;
};

const invalidateCFCacheAndWait = async (CFDistributionID, CFInvalidationPaths) => {
    CFDistributionID = core.getInput('cf_distribution_id');
    CFInvalidationPaths = core.getInput('cf_invalidation_paths');
    const invalidationRequestBody = {
        DistributionId: CFDistributionID, 
        InvalidationBatch: { 
          Paths: {
            Quantity: CFInvalidationPaths.length, 
            Items: CFInvalidationPaths
            },
          CallerReference: `${Date.now()}`, 
        },
    };
    try {
        console.log(`Creating invalidation for CloudFront distribution => ${CFDistributionID} ...`)
        const invalidationResponse = await cloudfront.send(new CreateInvalidationCommand(invalidationRequestBody));
        var CFInvalidationID = invalidationResponse.Invalidation.Id;
        console.log(`Invalidation created: ${CFInvalidationID}`);
    } catch (error) {
        console.error('Error creating or checking invalidation:', error);
    }

    try {
        console.log(`Checking the status of the invalidation ${CFInvalidationID} for the CloudFront distribution => ${CFDistributionID} ...`)
        const CFInvalidationStatus = await checkCFCacheInvalidationStatus(CFDistributionID, CFInvalidationID);
        console.log(`Invalidation completed: ${CFInvalidationStatus}`);
    } catch (error) {
        console.error('Error creating or checking invalidation:', error);
    }
}

invalidateCFCacheAndWait();