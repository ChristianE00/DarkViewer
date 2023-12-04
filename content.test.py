from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
current_directory = os.getcwd()
options = webdriver.ChromeOptions()
options.add_argument(current_directory)

driver = webdriver.Chrome(options=options)
driver.get('chrome-extension://fgjngikdaemnlopoiomdkilifbgchddp/popup.html')
wait = WebDriverWait(driver, 10)  # wait up to 10 seconds
element = wait.until(EC.presence_of_element_located((By.ID, 'toggle-dark-mode')))
#element = driver.find_element_by_id('toggle-dark-mode')  # replace with the actual ID
element.click()
driver.get("https://users.cs.utah.edu/~snagy/courses/cs4440/")
#driver.execute_script("testToggleDarkMode()")
# Get the background color of the body
##background_color = driver.find_element_by_tag_name('body').value_of_css_property('background-color')
background_color = driver.fine_element(By.TAG_NAME, 'body').value_of_css_property('background-color')
# Check the background color
assert background_color != 'rgb(255, 255, 255)'  # replace with the expected color in dark mode