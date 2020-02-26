resource "azurerm_resource_group" "rg" {
  name = join(
    "-",
    ["rg", var.app-short-name, var.env-short-name, var.region],
  )
  location = var.region
}

