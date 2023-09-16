import { 
  CreatedBase as CreatedBaseEvent,
} from '../generated/PlanetBase/PlanetBase'
import { ONE_BI, TWO_BD, ZERO_BD, handleProfileCreateInfoState } from './helpers'

export function handleCreatedBase(event: CreatedBaseEvent): void {
  let id = event.transaction.hash.toHexString()
  let entity = handleProfileCreateInfoState(id)
  entity.crateAt = event.block.timestamp
  entity.profileId = event.params.baseId
  entity.profileType = TWO_BD.toString()
  entity.timestamp = event.block.timestamp
  entity.planetId = event.params.planetId
  entity.baseName = event.params.name

  entity.save()
}