import * as digitalocean from '@pulumi/digitalocean';

const cluster = new digitalocean.KubernetesCluster('os-k8s-cluster-dev', {
  autoUpgrade: true,
  nodePool: {
    name: 'default',
    size: digitalocean.DropletSlug.DropletS1VCPU2GB,
    nodeCount: 1,
  },
  region: digitalocean.Region.AMS3,
  version: 'latest',
});

export const kubeconfig = cluster.status.apply((status) => {
  if (status === 'running') {
    const clusterDataSource = cluster.name.apply((name) =>
      digitalocean.getKubernetesCluster({ name }),
    );
    return clusterDataSource.kubeConfigs[0].rawConfig;
  } else {
    return cluster.kubeConfigs[0].rawConfig;
  }
});
