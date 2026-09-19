export function selectAuditActor(actorId: string | null | undefined, fallbackActorId: string): string {
  return actorId ?? fallbackActorId;
}
