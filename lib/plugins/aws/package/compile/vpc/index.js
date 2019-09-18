'use strict';

const BbPromise = require('bluebird');
const compileVpc = require('./lib/vpc');
const compileEip = require('./lib/eip');
const compileInternetGateway = require('./lib/internetGateway');
const compileVpcGatewayAttachment = require('./lib/vpcGatewayAttachment');
const compileRouteTables = require('./lib/routeTables');
const compileSubnets = require('./lib/subnets');
const compileNatGateways = require('./lib/natGateways');
const compileRoutes = require('./lib/routes');
const compileSubnetRouteTableAssociations = require('./lib/subnetRouteTableAssociations');
const compileLambdaSecurityGroup = require('./lib/lambdaSecurityGroup');
const updateFunctionConfigs = require('./lib/updateFunctionConfigs');
const compileCloudFormationOutputs = require('./lib/cloudFormationOutputs');

class AwsCompileVpc {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.provider = this.serverless.getProvider('aws');

    Object.assign(
      this,
      compileVpc,
      compileEip,
      compileInternetGateway,
      compileVpcGatewayAttachment,
      compileRouteTables,
      compileSubnets,
      compileNatGateways,
      compileRoutes,
      compileSubnetRouteTableAssociations,
      compileLambdaSecurityGroup,
      updateFunctionConfigs,
      compileCloudFormationOutputs
    );

    this.hooks = {
      'package:compileVpc': () => {
        const { vpc } = this.serverless.service;

        if (
          (typeof vpc === 'boolean' && vpc) ||
          (typeof vpc === 'object' && Object.keys(vpc).length > 0)
        ) {
          return BbPromise.bind(this)
            .then(this.compileVpc)
            .then(this.compileEip)
            .then(this.compileInternetGateway)
            .then(this.compileVpcGatewayAttachment)
            .then(this.compileRouteTables)
            .then(this.compileSubnets)
            .then(this.compileNatGateways)
            .then(this.compileRoutes)
            .then(this.compileSubnetRouteTableAssociations)
            .then(this.compileLambdaSecurityGroup)
            .then(this.updateFunctionConfigs)
            .then(this.compileCloudFormationOutputs);
        }

        return BbPromise.resolve();
      },
    };
  }
}

module.exports = AwsCompileVpc;