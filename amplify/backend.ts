import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

// backend.addOutput({
//   auth: {
//     aws_region: "eu-central-1",
//     user_pool_id: "eu-central-1_JwedhQXX3",
//     user_pool_client_id: "4tssje74o8lgun619bnlk269gg",
//     identity_pool_id: "eu-central-1:ebc5c4b2-3f98-46d4-b2bb-0d3b980daa3a",
//     username_attributes: ["email"],
//     standard_required_attributes: ["email"],
//     user_verification_types: ["email"],
//     unauthenticated_identities_enabled: true,
//     password_policy: {
//       min_length: 8,
//       require_lowercase: true,
//       require_uppercase: true,
//       require_numbers: true,
//       require_symbols: true,
//     }
//   }
// });

const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;