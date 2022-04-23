export class Settings {
  private static readonly TILE_SIZE = 16
  private static ZOOM = 3

  public static get zoom(): number {
    return Settings.ZOOM
  }
  public static get tileSize(): number {
    return Settings.TILE_SIZE * Settings.ZOOM
  }
}