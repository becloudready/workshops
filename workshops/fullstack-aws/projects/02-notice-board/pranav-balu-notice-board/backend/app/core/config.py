from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGO_USERNAME: str
    MONGO_PASSWORD: str
    MONGO_DATABASE: str = "workshop"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def mongo_uri(self) -> str:
        return (
            "mongodb+srv://"
            f"{self.MONGO_USERNAME}:{self.MONGO_PASSWORD}"
            "@cluster0.jcaprlc.mongodb.net/"
            "?appName=Cluster0"
        )


settings = Settings()