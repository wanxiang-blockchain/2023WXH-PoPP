import { 
  Followed1 as Followed1Event,
  PostCreated as PostCreatedEvent,
  MirrorCreated as MirrorCreatedEvent
} from '../generated/HubEvents1/HubEvents1'
import { handleFollowedState, handleContentInfoState } from './helpers'

export function handleFollowed1(event: Followed1Event): void {
  let id = event.params.follower.toHexString().concat('-').concat(event.params.profileId.toString())
  let entity =  handleFollowedState(id)
  entity.followModuleData = event.params.followModuleData
  entity.follower = event.params.follower
  entity.profileId = event.params.profileId
  entity.timestamp = event.params.timestamp
  entity.crateAt = event.block.timestamp
  
  entity.save()
}

export function handlePostCreated(event: PostCreatedEvent): void {
  let id = event.transaction.hash.toHexString()
  let entity = handleContentInfoState(id)
  entity.baseProfileId = event.params.baseProfileId
  entity.collectModule = event.params.collectModule
  entity.collectModuleReturnData = event.params.collectModuleReturnData
  entity.contentURI = event.params.contentURI
  entity.planetProfileId = event.params.planetProfileId
  entity.profileId = event.params.profileId
  entity.pubId = event.params.pubId
  entity.referenceModule = event.params.referenceModule
  entity.referenceModuleReturnData = event.params.referenceModuleReturnData
  entity.timestamp = event.params.timestamp
  entity.crateAt = event.block.timestamp
  entity.type = 'post'

  entity.save()
}

export function handleMirrorCreated(event: MirrorCreatedEvent): void {
  let id = event.transaction.hash.toHexString()
  let entity = handleContentInfoState(id)
  entity.profileId = event.params.profileId
  entity.pubId = event.params.pubId
  entity.referenceModule = event.params.referenceModule
  entity.referenceModuleReturnData = event.params.referenceModuleReturnData
  entity.timestamp = event.params.timestamp
  entity.crateAt = event.block.timestamp
  entity.profileIdPointed = event.params.profileIdPointed
  entity.pubIdPointed = event.params.pubIdPointed
  entity.type = 'mirror'

  entity.save()
}