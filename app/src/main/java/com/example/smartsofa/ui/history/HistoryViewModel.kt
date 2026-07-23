package com.example.smartsofa.ui.history

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.smartsofa.data.firebase.FirebaseDatabaseManager
import com.example.smartsofa.data.model.HistoryItem
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

class HistoryViewModel(
    private val firebaseManager: FirebaseDatabaseManager = FirebaseDatabaseManager
) : ViewModel() {
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery

    private val _selectedFilter = MutableStateFlow("All")
    val selectedFilter: StateFlow<String> = _selectedFilter

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading

    val historyItems = firebaseManager.observeHistory()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val filteredItems = combine(
        historyItems,
        _searchQuery,
        _selectedFilter
    ) { items, query, filter ->
        items.filter { item ->
            val matchesSearch = if (query.isBlank()) true else {
                item.description.contains(query, ignoreCase = true) ||
                        item.type.contains(query, ignoreCase = true)
            }
            val matchesFilter = if (filter == "All") true else {
                when (filter) {
                    "Person" -> item.type.startsWith("person")
                    "Fan" -> item.type.startsWith("fan")
                    "Light" -> item.type.startsWith("light")
                    "ESP32" -> item.type.startsWith("esp32")
                    "Firebase" -> item.type.startsWith("firebase")
                    else -> true
                }
            }
            matchesSearch && matchesFilter
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun updateFilter(filter: String) {
        _selectedFilter.value = filter
    }
}
