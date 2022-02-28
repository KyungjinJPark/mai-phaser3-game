export class Settings {
  private static readonly TILE_SIZE = 16
  private static ZOOM = 3

  public static getZoom(): number {
    return Settings.ZOOM
  }
  public static getTileSize(): number {
    return Settings.TILE_SIZE * Settings.ZOOM
  }
}