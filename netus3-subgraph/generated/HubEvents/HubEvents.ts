// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class BaseInitialized extends ethereum.Event {
  get params(): BaseInitialized__Params {
    return new BaseInitialized__Params(this);
  }
}

export class BaseInitialized__Params {
  _event: BaseInitialized;

  constructor(event: BaseInitialized) {
    this._event = event;
  }

  get name(): string {
    return this._event.parameters[0].value.toString();
  }

  get symbol(): string {
    return this._event.parameters[1].value.toString();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class CollectModuleWhitelisted extends ethereum.Event {
  get params(): CollectModuleWhitelisted__Params {
    return new CollectModuleWhitelisted__Params(this);
  }
}

export class CollectModuleWhitelisted__Params {
  _event: CollectModuleWhitelisted;

  constructor(event: CollectModuleWhitelisted) {
    this._event = event;
  }

  get collectModule(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get whitelisted(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class CollectNFTDeployed extends ethereum.Event {
  get params(): CollectNFTDeployed__Params {
    return new CollectNFTDeployed__Params(this);
  }
}

export class CollectNFTDeployed__Params {
  _event: CollectNFTDeployed;

  constructor(event: CollectNFTDeployed) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get collectNFT(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class CollectNFTInitialized extends ethereum.Event {
  get params(): CollectNFTInitialized__Params {
    return new CollectNFTInitialized__Params(this);
  }
}

export class CollectNFTInitialized__Params {
  _event: CollectNFTInitialized;

  constructor(event: CollectNFTInitialized) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class CollectNFTTransferred extends ethereum.Event {
  get params(): CollectNFTTransferred__Params {
    return new CollectNFTTransferred__Params(this);
  }
}

export class CollectNFTTransferred__Params {
  _event: CollectNFTTransferred;

  constructor(event: CollectNFTTransferred) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get collectNFTId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get from(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[4].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }
}

export class Collected extends ethereum.Event {
  get params(): Collected__Params {
    return new Collected__Params(this);
  }
}

export class Collected__Params {
  _event: Collected;

  constructor(event: Collected) {
    this._event = event;
  }

  get collector(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get profileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get rootProfileId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get rootPubId(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get collectModuleData(): Bytes {
    return this._event.parameters[5].value.toBytes();
  }

  get timestamp(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class CommentCreated extends ethereum.Event {
  get params(): CommentCreated__Params {
    return new CommentCreated__Params(this);
  }
}

export class CommentCreated__Params {
  _event: CommentCreated;

  constructor(event: CommentCreated) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get baseProfileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get planetProfileId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get contentURI(): string {
    return this._event.parameters[4].value.toString();
  }

  get profileIdPointed(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get pubIdPointed(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }

  get referenceModuleData(): Bytes {
    return this._event.parameters[7].value.toBytes();
  }

  get collectModule(): Address {
    return this._event.parameters[8].value.toAddress();
  }

  get collectModuleReturnData(): Bytes {
    return this._event.parameters[9].value.toBytes();
  }

  get referenceModule(): Address {
    return this._event.parameters[10].value.toAddress();
  }

  get referenceModuleReturnData(): Bytes {
    return this._event.parameters[11].value.toBytes();
  }

  get timestamp(): BigInt {
    return this._event.parameters[12].value.toBigInt();
  }
}

export class CommentCreated1 extends ethereum.Event {
  get params(): CommentCreated1__Params {
    return new CommentCreated1__Params(this);
  }
}

export class CommentCreated1__Params {
  _event: CommentCreated1;

  constructor(event: CommentCreated1) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get baseProfileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get planetProfileId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get contentURI(): string {
    return this._event.parameters[4].value.toString();
  }

  get profileIdPointed(): BigInt {
    return this._event.parameters[5].value.toBigInt();
  }

  get pubIdPointed(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class CommentCreated2 extends ethereum.Event {
  get params(): CommentCreated2__Params {
    return new CommentCreated2__Params(this);
  }
}

export class CommentCreated2__Params {
  _event: CommentCreated2;

  constructor(event: CommentCreated2) {
    this._event = event;
  }

  get pubId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get referenceModuleData(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get collectModule(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get collectModuleReturnData(): Bytes {
    return this._event.parameters[3].value.toBytes();
  }

  get referenceModule(): Address {
    return this._event.parameters[4].value.toAddress();
  }

  get referenceModuleReturnData(): Bytes {
    return this._event.parameters[5].value.toBytes();
  }

  get timestamp(): BigInt {
    return this._event.parameters[6].value.toBigInt();
  }
}

export class DefaultProfileSet extends ethereum.Event {
  get params(): DefaultProfileSet__Params {
    return new DefaultProfileSet__Params(this);
  }
}

export class DefaultProfileSet__Params {
  _event: DefaultProfileSet;

  constructor(event: DefaultProfileSet) {
    this._event = event;
  }

  get wallet(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get profileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class DispatcherSet extends ethereum.Event {
  get params(): DispatcherSet__Params {
    return new DispatcherSet__Params(this);
  }
}

export class DispatcherSet__Params {
  _event: DispatcherSet;

  constructor(event: DispatcherSet) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get dispatcher(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class EmergencyAdminSet extends ethereum.Event {
  get params(): EmergencyAdminSet__Params {
    return new EmergencyAdminSet__Params(this);
  }
}

export class EmergencyAdminSet__Params {
  _event: EmergencyAdminSet;

  constructor(event: EmergencyAdminSet) {
    this._event = event;
  }

  get caller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get oldEmergencyAdmin(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newEmergencyAdmin(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class FeeModuleBaseConstructed extends ethereum.Event {
  get params(): FeeModuleBaseConstructed__Params {
    return new FeeModuleBaseConstructed__Params(this);
  }
}

export class FeeModuleBaseConstructed__Params {
  _event: FeeModuleBaseConstructed;

  constructor(event: FeeModuleBaseConstructed) {
    this._event = event;
  }

  get moduleGlobals(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class FollowModuleSet extends ethereum.Event {
  get params(): FollowModuleSet__Params {
    return new FollowModuleSet__Params(this);
  }
}

export class FollowModuleSet__Params {
  _event: FollowModuleSet;

  constructor(event: FollowModuleSet) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get followModule(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get followModuleReturnData(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class FollowModuleWhitelisted extends ethereum.Event {
  get params(): FollowModuleWhitelisted__Params {
    return new FollowModuleWhitelisted__Params(this);
  }
}

export class FollowModuleWhitelisted__Params {
  _event: FollowModuleWhitelisted;

  constructor(event: FollowModuleWhitelisted) {
    this._event = event;
  }

  get followModule(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get whitelisted(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class FollowNFTDelegatedPowerChanged extends ethereum.Event {
  get params(): FollowNFTDelegatedPowerChanged__Params {
    return new FollowNFTDelegatedPowerChanged__Params(this);
  }
}

export class FollowNFTDelegatedPowerChanged__Params {
  _event: FollowNFTDelegatedPowerChanged;

  constructor(event: FollowNFTDelegatedPowerChanged) {
    this._event = event;
  }

  get delegate(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newPower(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class FollowNFTDeployed extends ethereum.Event {
  get params(): FollowNFTDeployed__Params {
    return new FollowNFTDeployed__Params(this);
  }
}

export class FollowNFTDeployed__Params {
  _event: FollowNFTDeployed;

  constructor(event: FollowNFTDeployed) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get followNFT(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class FollowNFTInitialized extends ethereum.Event {
  get params(): FollowNFTInitialized__Params {
    return new FollowNFTInitialized__Params(this);
  }
}

export class FollowNFTInitialized__Params {
  _event: FollowNFTInitialized;

  constructor(event: FollowNFTInitialized) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get timestamp(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class FollowNFTTransferred extends ethereum.Event {
  get params(): FollowNFTTransferred__Params {
    return new FollowNFTTransferred__Params(this);
  }
}

export class FollowNFTTransferred__Params {
  _event: FollowNFTTransferred;

  constructor(event: FollowNFTTransferred) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get followNFTId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get from(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class FollowNFTURISet extends ethereum.Event {
  get params(): FollowNFTURISet__Params {
    return new FollowNFTURISet__Params(this);
  }
}

export class FollowNFTURISet__Params {
  _event: FollowNFTURISet;

  constructor(event: FollowNFTURISet) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get followNFTURI(): string {
    return this._event.parameters[1].value.toString();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class Followed extends ethereum.Event {
  get params(): Followed__Params {
    return new Followed__Params(this);
  }
}

export class Followed__Params {
  _event: Followed;

  constructor(event: Followed) {
    this._event = event;
  }

  get follower(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get profileIds(): Array<BigInt> {
    return this._event.parameters[1].value.toBigIntArray();
  }

  get followModuleDatas(): Array<Bytes> {
    return this._event.parameters[2].value.toBytesArray();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class Followed1 extends ethereum.Event {
  get params(): Followed1__Params {
    return new Followed1__Params(this);
  }
}

export class Followed1__Params {
  _event: Followed1;

  constructor(event: Followed1) {
    this._event = event;
  }

  get follower(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get profileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get followModuleData(): Bytes {
    return this._event.parameters[2].value.toBytes();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class FollowsApproved extends ethereum.Event {
  get params(): FollowsApproved__Params {
    return new FollowsApproved__Params(this);
  }
}

export class FollowsApproved__Params {
  _event: FollowsApproved;

  constructor(event: FollowsApproved) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get profileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get addresses(): Array<Address> {
    return this._event.parameters[2].value.toAddressArray();
  }

  get approved(): Array<boolean> {
    return this._event.parameters[3].value.toBooleanArray();
  }

  get timestamp(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }
}

export class FollowsToggled extends ethereum.Event {
  get params(): FollowsToggled__Params {
    return new FollowsToggled__Params(this);
  }
}

export class FollowsToggled__Params {
  _event: FollowsToggled;

  constructor(event: FollowsToggled) {
    this._event = event;
  }

  get owner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get profileIds(): Array<BigInt> {
    return this._event.parameters[1].value.toBigIntArray();
  }

  get enabled(): Array<boolean> {
    return this._event.parameters[2].value.toBooleanArray();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class GovernanceSet extends ethereum.Event {
  get params(): GovernanceSet__Params {
    return new GovernanceSet__Params(this);
  }
}

export class GovernanceSet__Params {
  _event: GovernanceSet;

  constructor(event: GovernanceSet) {
    this._event = event;
  }

  get caller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get prevGovernance(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get newGovernance(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class MirrorCreated extends ethereum.Event {
  get params(): MirrorCreated__Params {
    return new MirrorCreated__Params(this);
  }
}

export class MirrorCreated__Params {
  _event: MirrorCreated;

  constructor(event: MirrorCreated) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get profileIdPointed(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get pubIdPointed(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get referenceModuleData(): Bytes {
    return this._event.parameters[4].value.toBytes();
  }

  get referenceModule(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get referenceModuleReturnData(): Bytes {
    return this._event.parameters[6].value.toBytes();
  }

  get timestamp(): BigInt {
    return this._event.parameters[7].value.toBigInt();
  }
}

export class ModuleBaseConstructed extends ethereum.Event {
  get params(): ModuleBaseConstructed__Params {
    return new ModuleBaseConstructed__Params(this);
  }
}

export class ModuleBaseConstructed__Params {
  _event: ModuleBaseConstructed;

  constructor(event: ModuleBaseConstructed) {
    this._event = event;
  }

  get hub(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ModuleGlobalsCurrencyWhitelisted extends ethereum.Event {
  get params(): ModuleGlobalsCurrencyWhitelisted__Params {
    return new ModuleGlobalsCurrencyWhitelisted__Params(this);
  }
}

export class ModuleGlobalsCurrencyWhitelisted__Params {
  _event: ModuleGlobalsCurrencyWhitelisted;

  constructor(event: ModuleGlobalsCurrencyWhitelisted) {
    this._event = event;
  }

  get currency(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get prevWhitelisted(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get whitelisted(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class ModuleGlobalsGovernanceSet extends ethereum.Event {
  get params(): ModuleGlobalsGovernanceSet__Params {
    return new ModuleGlobalsGovernanceSet__Params(this);
  }
}

export class ModuleGlobalsGovernanceSet__Params {
  _event: ModuleGlobalsGovernanceSet;

  constructor(event: ModuleGlobalsGovernanceSet) {
    this._event = event;
  }

  get prevGovernance(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newGovernance(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ModuleGlobalsTreasuryFeeSet extends ethereum.Event {
  get params(): ModuleGlobalsTreasuryFeeSet__Params {
    return new ModuleGlobalsTreasuryFeeSet__Params(this);
  }
}

export class ModuleGlobalsTreasuryFeeSet__Params {
  _event: ModuleGlobalsTreasuryFeeSet;

  constructor(event: ModuleGlobalsTreasuryFeeSet) {
    this._event = event;
  }

  get prevTreasuryFee(): i32 {
    return this._event.parameters[0].value.toI32();
  }

  get newTreasuryFee(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ModuleGlobalsTreasurySet extends ethereum.Event {
  get params(): ModuleGlobalsTreasurySet__Params {
    return new ModuleGlobalsTreasurySet__Params(this);
  }
}

export class ModuleGlobalsTreasurySet__Params {
  _event: ModuleGlobalsTreasurySet;

  constructor(event: ModuleGlobalsTreasurySet) {
    this._event = event;
  }

  get prevTreasury(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newTreasury(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class PlanetKickOutFollower extends ethereum.Event {
  get params(): PlanetKickOutFollower__Params {
    return new PlanetKickOutFollower__Params(this);
  }
}

export class PlanetKickOutFollower__Params {
  _event: PlanetKickOutFollower;

  constructor(event: PlanetKickOutFollower) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get follower(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class PostCreated extends ethereum.Event {
  get params(): PostCreated__Params {
    return new PostCreated__Params(this);
  }
}

export class PostCreated__Params {
  _event: PostCreated;

  constructor(event: PostCreated) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get baseProfileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get pubId(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get planetProfileId(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }

  get contentURI(): string {
    return this._event.parameters[4].value.toString();
  }

  get collectModule(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get collectModuleReturnData(): Bytes {
    return this._event.parameters[6].value.toBytes();
  }

  get referenceModule(): Address {
    return this._event.parameters[7].value.toAddress();
  }

  get referenceModuleReturnData(): Bytes {
    return this._event.parameters[8].value.toBytes();
  }

  get timestamp(): BigInt {
    return this._event.parameters[9].value.toBigInt();
  }
}

export class ProfileCreated extends ethereum.Event {
  get params(): ProfileCreated__Params {
    return new ProfileCreated__Params(this);
  }
}

export class ProfileCreated__Params {
  _event: ProfileCreated;

  constructor(event: ProfileCreated) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get creator(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get to(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get handle(): string {
    return this._event.parameters[3].value.toString();
  }

  get imageURI(): string {
    return this._event.parameters[4].value.toString();
  }

  get followModule(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get followModuleReturnData(): Bytes {
    return this._event.parameters[6].value.toBytes();
  }

  get followNFTURI(): string {
    return this._event.parameters[7].value.toString();
  }

  get timestamp(): BigInt {
    return this._event.parameters[8].value.toBigInt();
  }

  get profileType(): i32 {
    return this._event.parameters[9].value.toI32();
  }
}

export class ProfileCreatorWhitelisted extends ethereum.Event {
  get params(): ProfileCreatorWhitelisted__Params {
    return new ProfileCreatorWhitelisted__Params(this);
  }
}

export class ProfileCreatorWhitelisted__Params {
  _event: ProfileCreatorWhitelisted;

  constructor(event: ProfileCreatorWhitelisted) {
    this._event = event;
  }

  get profileCreator(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get whitelisted(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ProfileImageURISet extends ethereum.Event {
  get params(): ProfileImageURISet__Params {
    return new ProfileImageURISet__Params(this);
  }
}

export class ProfileImageURISet__Params {
  _event: ProfileImageURISet;

  constructor(event: ProfileImageURISet) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get imageURI(): string {
    return this._event.parameters[1].value.toString();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ProfileMetadataSet extends ethereum.Event {
  get params(): ProfileMetadataSet__Params {
    return new ProfileMetadataSet__Params(this);
  }
}

export class ProfileMetadataSet__Params {
  _event: ProfileMetadataSet;

  constructor(event: ProfileMetadataSet) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get metadata(): string {
    return this._event.parameters[1].value.toString();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class ProfileType extends ethereum.Event {
  get params(): ProfileType__Params {
    return new ProfileType__Params(this);
  }
}

export class ProfileType__Params {
  _event: ProfileType;

  constructor(event: ProfileType) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get profileType(): i32 {
    return this._event.parameters[1].value.toI32();
  }
}

export class ReferenceModuleWhitelisted extends ethereum.Event {
  get params(): ReferenceModuleWhitelisted__Params {
    return new ReferenceModuleWhitelisted__Params(this);
  }
}

export class ReferenceModuleWhitelisted__Params {
  _event: ReferenceModuleWhitelisted;

  constructor(event: ReferenceModuleWhitelisted) {
    this._event = event;
  }

  get referenceModule(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get whitelisted(): boolean {
    return this._event.parameters[1].value.toBoolean();
  }

  get timestamp(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }
}

export class SetMuteFollower extends ethereum.Event {
  get params(): SetMuteFollower__Params {
    return new SetMuteFollower__Params(this);
  }
}

export class SetMuteFollower__Params {
  _event: SetMuteFollower;

  constructor(event: SetMuteFollower) {
    this._event = event;
  }

  get baseId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get follower(): Address {
    return this._event.parameters[1].value.toAddress();
  }

  get mute(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class SetMutePoppProfile extends ethereum.Event {
  get params(): SetMutePoppProfile__Params {
    return new SetMutePoppProfile__Params(this);
  }
}

export class SetMutePoppProfile__Params {
  _event: SetMutePoppProfile;

  constructor(event: SetMutePoppProfile) {
    this._event = event;
  }

  get baseId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get poppProfileId(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get mute(): boolean {
    return this._event.parameters[2].value.toBoolean();
  }
}

export class SetProfileAuthHubAddress extends ethereum.Event {
  get params(): SetProfileAuthHubAddress__Params {
    return new SetProfileAuthHubAddress__Params(this);
  }
}

export class SetProfileAuthHubAddress__Params {
  _event: SetProfileAuthHubAddress;

  constructor(event: SetProfileAuthHubAddress) {
    this._event = event;
  }

  get profileId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get authHubAddress(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class StateSet extends ethereum.Event {
  get params(): StateSet__Params {
    return new StateSet__Params(this);
  }
}

export class StateSet__Params {
  _event: StateSet;

  constructor(event: StateSet) {
    this._event = event;
  }

  get caller(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get prevState(): i32 {
    return this._event.parameters[1].value.toI32();
  }

  get newState(): i32 {
    return this._event.parameters[2].value.toI32();
  }

  get timestamp(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class HubEvents extends ethereum.SmartContract {
  static bind(address: Address): HubEvents {
    return new HubEvents("HubEvents", address);
  }
}
