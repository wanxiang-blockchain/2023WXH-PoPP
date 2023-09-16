import { BigInt, Bytes } from '@graphprotocol/graph-ts'
import { ContentInfo, FollowInfo, ProfileCreateInfo } from '../generated/schema'

export let ZERO_BD = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let TWO_BD = BigInt.fromI32(2)
export let ZONE_ADDRESS = Bytes.fromHexString("0x0000000000000000000000000000000000000000")

export function handleFollowedState(id: String):FollowInfo {
  let entity = FollowInfo.load(id.toString())
  if (!entity) {
    entity = new FollowInfo(id.toString())
    entity.followModuleData = ZONE_ADDRESS
    entity.profileId = ZERO_BD
    entity.timestamp = ZERO_BD
    entity.follower = ZONE_ADDRESS
    entity.crateAt = ZERO_BD
    entity.isProhibitionAddress = false
    entity.isProhibitionProfileId = false
    entity.isKickOut = false
  }

  entity.save()
  return entity as FollowInfo
}

export function handleProfileCreateInfoState(id: String):ProfileCreateInfo {
  let entity = ProfileCreateInfo.load(id.toString())
  if (!entity) {
    entity = new ProfileCreateInfo(id.toString())
    entity.crateAt = ZERO_BD
    entity.profileId = ZERO_BD
    entity.to = ZONE_ADDRESS
    entity.creator = ZONE_ADDRESS
    entity.followModule = ZONE_ADDRESS
    entity.followModuleReturnData = ZONE_ADDRESS
    entity.followNFTURI = ''
    entity.handle = ''
    entity.imageURI = ''
    entity.profileType = '-1'
    entity.timestamp = ZERO_BD
    entity.planetId = ZERO_BD
    entity.baseName = ''
  }

  entity.save()
  return entity as ProfileCreateInfo
}

export function handleContentInfoState(id: String): ContentInfo {
  let entity = ContentInfo.load(id.toString())
  if (!entity) {
    entity = new ContentInfo(id.toString())
    entity.crateAt = ZERO_BD
    entity.profileId = ZERO_BD
    entity.profileIdPointed = ZERO_BD
    entity.pubIdPointed = ZERO_BD
    entity.baseProfileId = ZERO_BD
    entity.collectModule = ZONE_ADDRESS
    entity.collectModuleReturnData = ZONE_ADDRESS
    entity.contentURI = ''
    entity.planetProfileId = ZERO_BD
    entity.profileId = ZERO_BD
    entity.pubId = ZERO_BD
    entity.referenceModule = ZONE_ADDRESS
    entity.referenceModuleReturnData = ZONE_ADDRESS
    entity.timestamp = ZERO_BD
    entity.crateAt = ZERO_BD
    entity.type = ''
  }

  entity.save()
  return entity as ContentInfo
}