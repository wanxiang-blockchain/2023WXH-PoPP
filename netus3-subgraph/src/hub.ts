import { 
  ProfileCreated as ProfileCreatedEvent,
} from '../generated/HubEvents/HubEvents'
import { ONE_BI, TWO_BD, ZERO_BD, handleProfileCreateInfoState  } from './helpers'

export function handleProfileCreated(event: ProfileCreatedEvent): void {
  let id = event.transaction.hash.toHexString()
  let entity = handleProfileCreateInfoState(id)
  entity.crateAt = event.block.timestamp
  entity.profileId = event.params.profileId
  entity.to = event.params.to
  entity.creator = event.params.creator
  entity.followModule = event.params.followModule
  entity.followModuleReturnData = event.params.followModuleReturnData
  entity.followNFTURI = event.params.followNFTURI
  entity.handle = event.params.handle
  entity.imageURI = event.params.imageURI
  entity.profileType = event.params.profileType.toString()
  entity.timestamp = event.params.timestamp

  entity.save()
}
